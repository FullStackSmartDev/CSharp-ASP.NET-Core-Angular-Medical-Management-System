using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/document")]
    public class DocumentController : ApiController
    {
        private readonly IDocumentService _documentService;
        private readonly IOptions<MedicoSettingsViewModel> _medicoSettings;

        public DocumentController(IOptions<MedicoSettingsViewModel> medicoSettings,
            IDocumentService documentService, ICompanySecurityService companySecurityService)
            : base(companySecurityService)
        {
            _medicoSettings = medicoSettings;
            _documentService = documentService;
        }

        [Route("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var document = await _documentService.GetById(id);
            if (document == null)
                return Ok();

            var patientId = document.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(document);
        }

        [Route("patient/{patientId}")]
        public async Task<IActionResult> GetByPatient(Guid patientId)
        {
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            return Ok(await _documentService.GetByPatientId(patientId));
        }


        [HttpPost]
        public async Task<IActionResult> Post([FromBody]DocumentViewModel documentViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var patientId = documentViewModel.PatientId;
            if (!await CompanySecurityService.UserHaveAccessToCompanyPatient(patientId))
                return Unauthorized();

            var createUpdateTask = documentViewModel.Id == Guid.Empty
                ? _documentService.Create(documentViewModel)
                : _documentService.Update(documentViewModel);

            await createUpdateTask;

            return Ok();
        }


        [HttpPost, DisableRequestSizeLimit]
        [Route("upload/{appointmentId}/{patientId}")]
        public IActionResult Upload(string appointmentId, string patientId)
        {
            var file = Request.Form.Files[0];
            var directoryPath = Path.Combine(appointmentId, patientId);
            var pathToSave = Path.Combine(_medicoSettings.Value.ScanDocumentUploadPath, directoryPath);

            if (!Directory.Exists(pathToSave))
            {
                Directory.CreateDirectory(pathToSave);
            }

            if (file.Length > 0)
            {
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                var dbPath = Path.Combine(directoryPath, fileName);
                var fullPath = Path.Combine(pathToSave, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                return Ok(new { dbPath });
            }

            return BadRequest();
        }

        [HttpPost, DisableRequestSizeLimit]
        [Route("upload-tiff/{appointmentId}/{patientId}")]
        public async Task<IActionResult> UploadTiff(string appointmentId, string patientId)
        {
            var fileName = Request.Form["filename"].ToArray()[0];
            var files = Request.Form.Files;
            if (files.Count > 0)
            {
                var directoryPath = Path.Combine(appointmentId, patientId);
                var pathToSave = Path.Combine(_medicoSettings.Value.ScanDocumentUploadPath, directoryPath);

                if (!Directory.Exists(pathToSave))
                {
                    Directory.CreateDirectory(pathToSave);
                }
                var dbPath = Path.Combine(directoryPath, fileName);
                var fullPath = Path.Combine(pathToSave, fileName);
                Encoder encoder = Encoder.SaveFlag;
                ImageCodecInfo encoderInfo = ImageCodecInfo.GetImageEncoders().First(i => i.MimeType == "image/tiff");
                EncoderParameters encoderParameters = new EncoderParameters(1);
                encoderParameters.Param[0] = new EncoderParameter(encoder, (long)EncoderValue.MultiFrame);

                // Save the first frame of the multi page tiff
                Bitmap firstImage;
                using (var ms = new MemoryStream())
                {
                    await files[0].CopyToAsync(ms);

                    firstImage = (Bitmap)Image.FromStream(ms);
                    {
                        firstImage.Save(fullPath, encoderInfo, encoderParameters);
                    }
                }

                encoderParameters.Param[0] = new EncoderParameter(encoder, (long)EncoderValue.FrameDimensionPage);

                // Add the remaining images to the tiff
                for (int i = 1; i < files.Count; i++)
                {
                    using (var ms = new MemoryStream())
                    {
                        await files[i].CopyToAsync(ms);
                        using (Bitmap img = (Bitmap)Image.FromStream(ms))
                        {
                            firstImage.SaveAdd(img, encoderParameters);
                        }
                    }

                }

                // Close out the file
                encoderParameters.Param[0] = new EncoderParameter(encoder, (long)EncoderValue.Flush);
                firstImage.SaveAdd(encoderParameters);
                return Ok(new { dbPath });
            }

            return BadRequest();
        }

        [Route("imagedata/{appointmentId}/{patientId}/{filename}")]
        public IActionResult ImageData(string appointmentId, string patientId, string filename)
        {
            var directoryPath = Path.Combine(appointmentId, patientId);
            var folderPath = Path.Combine(_medicoSettings.Value.ScanDocumentUploadPath, directoryPath);
            var realPath = Path.Combine(folderPath, filename);
            var dataUrl = $"data:image/{Path.GetExtension(realPath).Replace(".", "")};base64,{Convert.ToBase64String(System.IO.File.ReadAllBytes(realPath))}";

            return Ok(new { dataUrl });
        }
    }
}

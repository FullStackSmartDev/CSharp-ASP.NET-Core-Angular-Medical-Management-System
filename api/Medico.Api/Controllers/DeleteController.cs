using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Medico.Api.DB;
using Medico.Api.DB.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medico.Api.Controllers
{
    [Route("api/delete")]
    public class DeleteController : Controller
    {
        private readonly MedicoContext _medicoContext;

        public DeleteController(MedicoContext medicoContext)
        {
            _medicoContext = medicoContext;
        }

        #region template lookup item

        [HttpPost]
        [Route("templatelookupitem")]
        public async Task<IActionResult> TemplateLookupItem([FromBody]TemplateLookupItem templateLookupItem)
        {
            try
            {
                _medicoContext.Set<TemplateLookupItem>()
                    .Remove(templateLookupItem);

                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region template lookup item tracker

        [HttpPost]
        [Route("templatelookupitemtracker")]
        public async Task<IActionResult> TemplateLookupItemTracker([FromBody]TemplateLookupItemTracker templateLookupItemTracker)
        {
            try
            {
                _medicoContext.Set<TemplateLookupItemTracker>()
                    .Remove(templateLookupItemTracker);

                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region extra field

        [HttpPost]
        [Route("extrafield")]
        public async Task<IActionResult> ExtraField([FromBody]ExtraField extraField)
        {
            try
            {
                _medicoContext.Set<ExtraField>()
                    .Remove(extraField);

                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region addendum

        [HttpPost]
        [Route("addendum")]
        public async Task<IActionResult> Addendum([FromBody]Addendum addendum)
        {
            try
            {
                _medicoContext.Set<Addendum>()
                    .Remove(addendum);

                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region location

        [HttpPost]
        [Route("location")]
        public async Task<IActionResult> Location([FromBody]Location location)
        {
            try
            {
                _medicoContext.Set<Location>()
                    .Remove(location);

                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region room

        [HttpPost]
        [Route("room")]
        public async Task<IActionResult> Room([FromBody]Room room)
        {
            try
            {
                _medicoContext.Set<Room>()
                    .Remove(room);

                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region employee

        [HttpPost]
        [Route("employee")]
        public async Task<IActionResult> Employee([FromBody]Employee employee)
        {
            try
            {
                _medicoContext.Set<Employee>()
                    .Remove(employee);

                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region app user

        [HttpPost]
        [Route("appuser")]
        public async Task<IActionResult> AppUser([FromBody]AppUser appUser)
        {
            try
            {
                _medicoContext.Set<AppUser>()
                    .Remove(appUser);

                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region app user permission group

        [HttpPost]
        [Route("appuserpermissiongroup")]
        public async Task<IActionResult> AppUserPermissionGroup([FromBody]AppUserPermissionGroup appUserPermissionGroup)
        {
            try
            {
                var existedPermissionGroup = await _medicoContext.Set<AppUserPermissionGroup>()
                    .FirstOrDefaultAsync(ug => ug.AppUserId == appUserPermissionGroup.AppUserId);

                if (existedPermissionGroup != null)
                {
                    _medicoContext.Set<AppUserPermissionGroup>()
                        .Remove(appUserPermissionGroup);

                    await _medicoContext.SaveChangesAsync();
                }
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region template lookup item category

        [HttpPost]
        [Route("templatelookupitemcategory")]
        public async Task<IActionResult> TemplateLookupItemCategory([FromBody]TemplateLookupItemCategory templateLookupItemCategory)
        {   
            try
            {
                _medicoContext.Set<TemplateLookupItemCategory>()
                    .Remove(templateLookupItemCategory);

                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region template type

        [HttpPost]
        [Route("templatetype")]
        public async Task<IActionResult> TemplateType([FromBody]TemplateType templateType)
        {
            try
            {
                _medicoContext.Set<TemplateType>()
                    .Remove(templateType);

                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion

        #region template type

        [HttpPost]
        [Route("template")]
        public async Task<IActionResult> Template([FromBody]Template template)
        {
            try
            {
                _medicoContext.Set<Template>()
                    .Remove(template);

                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                return Ok(exception.Message);
            }

            return Ok(true);
        }

        #endregion
    }
}

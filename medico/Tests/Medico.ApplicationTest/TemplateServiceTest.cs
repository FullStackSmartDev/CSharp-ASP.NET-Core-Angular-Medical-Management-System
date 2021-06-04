using System;
using System.Threading.Tasks;
using AutoMapper;
using Medico.Application.AutoMapper;
using Medico.Application.Interfaces;
using Medico.Application.SelectableItemsManagement;
using Medico.Application.Services;
using Medico.Application.ViewModels.Template;
using Medico.ApplicationTest.IQueryableMock;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Moq;
using Xunit;

namespace Medico.ApplicationTest
{
    public class TemplateServiceTest
    {
        private readonly Guid _templateType1Guid = Guid.NewGuid();
        private readonly Guid _templateType2Guid = Guid.NewGuid();

        private readonly Guid _template1Guid = Guid.NewGuid();
        private readonly Guid _template2Guid = Guid.NewGuid();
        private readonly Guid _template3Guid = Guid.NewGuid();
        private readonly Guid _template4Guid = Guid.NewGuid();
        private readonly Guid _template5Guid = Guid.NewGuid();
        private readonly Guid _template6Guid = Guid.NewGuid();

        private readonly Template[] _templates;
        private readonly IMapper _mapper;
        private readonly Mock<ITemplateRepository> _templateRepositoryMock;
        private readonly Mock<ITemplateSelectableListRepository> _templateSelectableListRepositoryMock;
        private readonly Mock<IChiefComplaintTemplateRepository> _chiefComplaintTemplateRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<ISelectableItemsService> _selectableItemsServiceMock;
        private readonly Mock<ISelectableListService> _selectableListServiceMock;
        private readonly Mock<ITemplateTypeService> _templateTypeServiceMock;

        public TemplateServiceTest()
        {
            #region templates

            _templates = new[]
            {
                new Template
                {
                    Id = _template1Guid,
                    TemplateOrder = 1,
                    IsActive = true,
                    TemplateTypeId = _templateType1Guid
                },
                new Template
                {
                    TemplateOrder = 1,
                    IsActive = true,
                    TemplateTypeId = _templateType2Guid
                },
                new Template
                {
                    Id = _template2Guid,
                    TemplateOrder = null,
                    IsActive = false,
                    TemplateTypeId = _templateType1Guid
                },
                new Template
                {
                    Id = _template3Guid,
                    TemplateOrder = 2,
                    IsActive = true,
                    TemplateTypeId = _templateType1Guid
                },
                new Template
                {
                    Id = _template4Guid,
                    TemplateOrder = 3,
                    IsActive = true,
                    TemplateTypeId = _templateType1Guid
                },
                new Template
                {
                    Id = _template5Guid,
                    TemplateOrder = 4,
                    IsActive = true,
                    TemplateTypeId = _templateType1Guid
                },
                new Template
                {
                    Id = _template6Guid,
                    TemplateOrder = null,
                    IsActive = false,
                    TemplateTypeId = _templateType1Guid
                },
                new Template
                {
                    TemplateOrder = null,
                    IsActive = false,
                    TemplateTypeId = _templateType2Guid
                }
            };

            #endregion

            _mapper = AutoMapperConfig.RegisterMappings()
                .CreateMapper();

            _templateRepositoryMock = new Mock<ITemplateRepository>();
            _templateRepositoryMock.Setup(r => r.GetAll())
                .Returns(new AsyncEnumerable<Template>(_templates));

            _chiefComplaintTemplateRepositoryMock = new Mock<IChiefComplaintTemplateRepository>();
            _templateSelectableListRepositoryMock = new Mock<ITemplateSelectableListRepository>();

            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _selectableItemsServiceMock = new Mock<ISelectableItemsService>();

            _selectableListServiceMock = new Mock<ISelectableListService>();
            _templateTypeServiceMock = new Mock<ITemplateTypeService>();
        }

        #region reorder

        [Fact]
        public async Task Update_TemplatesHaveRightOrder_IfTemplatesReordered()
        {
            //Arrange
            var templateService = new TemplateService(_templateRepositoryMock.Object,
                _mapper,
                _chiefComplaintTemplateRepositoryMock.Object,
                _selectableItemsServiceMock.Object,
                _unitOfWorkMock.Object,
                _templateSelectableListRepositoryMock.Object,
                _selectableListServiceMock.Object,
                _templateTypeServiceMock.Object);

            var templates = new TemplatesOrdersVm();
            templates.TemplatesOrders.Add(new TemplateOrderVm
            {
                Id = _template1Guid,
                Order = 2
            });

            templates.TemplatesOrders.Add(new TemplateOrderVm
            {
                Id = _template3Guid,
                Order = 1
            });

            //Act
            await templateService.ReorderTemplates(templates);

            //Assert
            Assert.Equal(2, _templates[0].TemplateOrder);
            Assert.Equal(1, _templates[3].TemplateOrder);
        }

        #endregion

        #region deactivate template

        [Fact]
        public async Task Update_TemplatesHaveRightOrder_IfTemplateDeactivated()
        {
            //Arrange
            var templateService = new TemplateService(_templateRepositoryMock.Object,
                _mapper,
                _chiefComplaintTemplateRepositoryMock.Object,
                _selectableItemsServiceMock.Object,
                _unitOfWorkMock.Object,
                _templateSelectableListRepositoryMock.Object,
                _selectableListServiceMock.Object,
                _templateTypeServiceMock.Object);

            //Act
            await templateService.DeactivateTemplate(_template1Guid);

            //Assert
            Assert.Null(_templates[0].TemplateOrder);
            Assert.False(_templates[0].IsActive);
            Assert.Null(_templates[2].TemplateOrder);
            Assert.Equal(1, _templates[3].TemplateOrder);
            Assert.Equal(2, _templates[4].TemplateOrder);
            Assert.Equal(3, _templates[5].TemplateOrder);
            Assert.Null(_templates[6].TemplateOrder);
        }

        #endregion

        #region activate template

        [Fact]
        public async Task Update_TemplatesHaveRightOrder_IfTemplateActivated()
        {
            //Arrange
            var templateService = new TemplateService(_templateRepositoryMock.Object,
                _mapper,
                _chiefComplaintTemplateRepositoryMock.Object,
                _selectableItemsServiceMock.Object,
                _unitOfWorkMock.Object,
                _templateSelectableListRepositoryMock.Object,
                _selectableListServiceMock.Object,
                _templateTypeServiceMock.Object);

            //Act
            await templateService.ActivateTemplate(_template2Guid);

            //Assert
            Assert.Equal(1, _templates[0].TemplateOrder);
            Assert.Equal(5, _templates[2].TemplateOrder);
            Assert.True(_templates[1].IsActive);
            Assert.Equal(2, _templates[3].TemplateOrder);
            Assert.Equal(3, _templates[4].TemplateOrder);
            Assert.Equal(4, _templates[5].TemplateOrder);
            Assert.Null(_templates[6].TemplateOrder);
        }

        #endregion

        #region delete template

        [Fact]
        public async Task Delete_TemplatesHaveRightOrder_IfTemplateDeleted()
        {
            //Arrange
            var templateService = new TemplateService(_templateRepositoryMock.Object,
                _mapper,
                _chiefComplaintTemplateRepositoryMock.Object,
                _selectableItemsServiceMock.Object,
                _unitOfWorkMock.Object,
                _templateSelectableListRepositoryMock.Object,
                _selectableListServiceMock.Object,
                _templateTypeServiceMock.Object);

            //Act
            await templateService.Delete(_template1Guid);

            //Assert
            Assert.Null(_templates[2].TemplateOrder);
            Assert.Equal(1, _templates[3].TemplateOrder);
            Assert.Equal(2, _templates[4].TemplateOrder);
            Assert.Equal(3, _templates[5].TemplateOrder);
            Assert.Null(_templates[6].TemplateOrder);
        }

        [Fact]
        public async Task Delete_TemplatesOrdersNotChanged_IfInactiveTemplateDeleted()
        {
            //Arrange
            var templateService = new TemplateService(_templateRepositoryMock.Object,
                _mapper,
                _chiefComplaintTemplateRepositoryMock.Object,
                _selectableItemsServiceMock.Object,
                _unitOfWorkMock.Object,
                _templateSelectableListRepositoryMock.Object,
                _selectableListServiceMock.Object,
                _templateTypeServiceMock.Object);

            //Act
            await templateService.Delete(_template2Guid);

            //Assert
            Assert.Equal(1, _templates[0].TemplateOrder);
            Assert.Null(_templates[2].TemplateOrder);
            Assert.Equal(2, _templates[3].TemplateOrder);
            Assert.Equal(3, _templates[4].TemplateOrder);
            Assert.Equal(4, _templates[5].TemplateOrder);
            Assert.Null(_templates[6].TemplateOrder);
        }

        #endregion
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Medico.Application.AutoMapper;
using Medico.Application.Services;
using Medico.ApplicationTest.IQueryableMock;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Moq;
using Xunit;

namespace Medico.ApplicationTest
{
    public class SelectableListCategoryServiceTest
    {
        private readonly Guid _companyId = Guid.NewGuid();

        private readonly Guid _libraryCategory1Id = Guid.NewGuid();
        private readonly Guid _libraryCategory2Id = Guid.NewGuid();
        private readonly Guid _libraryCategory3Id = Guid.NewGuid();

        private readonly Guid _companyCategoryId = Guid.NewGuid();

        private readonly Mock<ISelectableListCategoryRepository> _selectableListCategoryRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly IMapper _mapper;

        public SelectableListCategoryServiceTest()
        {
            #region categories

            IList<SelectableListCategory> categories = new List<SelectableListCategory>
            {
                new SelectableListCategory
                {
                    Id = _libraryCategory1Id,
                    Title = "libraryCategory1Id",
                    Version = 1
                },
                new SelectableListCategory
                {
                    Id = _libraryCategory2Id,
                    Title = "libraryCategory2Id",
                    Version = 1
                },
                new SelectableListCategory
                {
                    Id = _libraryCategory3Id,
                    Title = "libraryCategory3Id",
                    Version = 1
                },
                new SelectableListCategory
                {
                    Id = _companyCategoryId,
                    Title = "CompanyCategory1Id",
                    Version = 1,
                    CompanyId = _companyId,
                    LibrarySelectableListCategoryId = _libraryCategory1Id
                }
            };

            #endregion

            _mapper = AutoMapperConfig.RegisterMappings()
                .CreateMapper();

            _selectableListCategoryRepositoryMock = new Mock<ISelectableListCategoryRepository>();
            _selectableListCategoryRepositoryMock.Setup(r => r.GetAll())
                .Returns(new AsyncEnumerable<SelectableListCategory>(categories));

            _unitOfWorkMock = new Mock<IUnitOfWork>();
        }

        #region import

        [Fact]
        public async Task Import_CategoryAddedToCompany_IfDoesNotExist()
        {
            //Arrange
            var selectableListCategoryService =
                new SelectableListCategoryService(_selectableListCategoryRepositoryMock.Object, _mapper, _unitOfWorkMock.Object);
            var importedCategories = new List<Guid> { _libraryCategory2Id };

            //Act
            var categoriesMap =
                await selectableListCategoryService.ImportFromLibrary(importedCategories, _companyId);

            //Assert
            _selectableListCategoryRepositoryMock.Verify(r =>
                r.AddRange(It.Is<IEnumerable<SelectableListCategory>>(categories =>
                    categories.First().LibrarySelectableListCategoryId == _libraryCategory2Id)));

            Assert.True(categoriesMap.ContainsKey(_libraryCategory2Id));
        }

        [Fact]
        public async Task Import_CategoryNotAddedToCompany_IfExists()
        {
            //Arrange
            var selectableListCategoryService =
                new SelectableListCategoryService(_selectableListCategoryRepositoryMock.Object, _mapper, _unitOfWorkMock.Object);
            var importedCategories = new List<Guid> { _libraryCategory1Id };

            //Act
            var categoriesMap =
                await selectableListCategoryService.ImportFromLibrary(importedCategories, _companyId);

            //Assert
            _selectableListCategoryRepositoryMock
                .Verify(r => r.AddRange(It.IsAny<IEnumerable<SelectableListCategory>>()), Times.Never);

            Assert.Equal(_companyCategoryId, categoriesMap[_libraryCategory1Id]);
        }

        #endregion
    }
}

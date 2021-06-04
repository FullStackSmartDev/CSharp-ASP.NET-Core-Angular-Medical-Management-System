using Medico.Data.Constants;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Medico.Data.Mappings
{
    public class MedicationsUpdateItemMap : IEntityTypeConfiguration<MedicationsUpdateItem>
    {
        public void Configure(EntityTypeBuilder<MedicationsUpdateItem> builder)
        {
            builder.HasKey(mui => mui.Id);
            builder.Property(mui => mui.Id).HasDefaultValueSql("newsequentialid()");

            builder.Property(c => c.Date).IsRequired();

            builder.Property(c => c.MedicationsFileName)
                .HasMaxLength(SqlColumnLength.Short).IsRequired();

            builder.Property(c => c.MedicationsFileName)
                .HasMaxLength(SqlColumnLength.TooLong);

            builder.Property(c => c.MedicationsFilePath)
                .HasMaxLength(SqlColumnLength.Long).IsRequired();

            builder.Property(c => c.Status).IsRequired();
        }
    }
}

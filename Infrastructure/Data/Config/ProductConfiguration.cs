using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Config
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.Property(p => p.Id).IsRequired();
            builder.Property(p => p.Name).IsRequired();
            builder.Property(p => p.Description).IsRequired();
            builder.Property(p => p.Price).HasColumnType("decimal(18,2)");
            builder.Property(p => p.PictureUrl).IsRequired();

            //Has one Product Brand => with many => has foreign key ProductBrandId
            builder.HasOne(b => b.ProductBrand).WithMany()
                   .HasForeignKey(p => p.ProductBrandId);

            //Has one Product Type => with many => has foreign key ProductTypeId
            builder.HasOne(t => t.ProductType).WithMany()
                   .HasForeignKey(p => p.ProductTypeId);
        }
    }
}

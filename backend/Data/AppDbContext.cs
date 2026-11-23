using Microsoft.EntityFrameworkCore;
using SecuAsset.Api.Models;

namespace SecuAsset.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserSession> UserSessions => Set<UserSession>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<AssetStatus> AssetStatuses => Set<AssetStatus>();
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<QrCode> QRCodes => Set<QrCode>();
    public DbSet<AssetStatusHistory> AssetStatusHistories => Set<AssetStatusHistory>();
    public DbSet<MaintenanceSchedule> MaintenanceSchedules => Set<MaintenanceSchedule>();
    public DbSet<MaintenanceRecord> MaintenanceRecords => Set<MaintenanceRecord>();
    public DbSet<Attachment> Attachments => Set<Attachment>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<RolePermission>().HasKey(x => new { x.RoleId, x.PermissionId });

        b.Entity<Role>().HasIndex(x => x.RoleCode).IsUnique();
        b.Entity<Permission>().HasIndex(x => x.PermissionCode).IsUnique();
        b.Entity<User>().HasIndex(x => x.Username).IsUnique();
        b.Entity<User>().HasIndex(x => x.Email).IsUnique().HasFilter("[Email] IS NOT NULL");
        b.Entity<UserSession>().HasIndex(x => x.RefreshTokenHash).IsUnique();
        b.Entity<Category>().HasIndex(x => x.CategoryCode).IsUnique();
        b.Entity<Location>().HasIndex(x => x.LocationCode).IsUnique();
        b.Entity<AssetStatus>().HasIndex(x => x.StatusCode).IsUnique();
        b.Entity<Asset>().HasIndex(x => x.AssetCode).IsUnique();
        b.Entity<Asset>().HasIndex(x => x.SerialNumber).IsUnique().HasFilter("[SerialNumber] IS NOT NULL");
        b.Entity<QrCode>().HasIndex(x => x.QRValue).IsUnique();

        b.Entity<Location>()
            .HasOne(x => x.Parent).WithMany(x => x.Children)
            .HasForeignKey(x => x.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        b.Entity<AssetStatusHistory>()
            .HasOne(x => x.OldStatus).WithMany()
            .HasForeignKey(x => x.OldStatusId)
            .OnDelete(DeleteBehavior.Restrict);
        b.Entity<AssetStatusHistory>()
            .HasOne(x => x.NewStatus).WithMany()
            .HasForeignKey(x => x.NewStatusId)
            .OnDelete(DeleteBehavior.Restrict);

        b.Entity<Asset>().HasOne(x => x.Category).WithMany(x => x.Assets)
            .HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
        b.Entity<Asset>().HasOne(x => x.Status).WithMany(x => x.Assets)
            .HasForeignKey(x => x.StatusId).OnDelete(DeleteBehavior.Restrict);

        // Ba FK có tên không theo quy ước nên phải khai báo tay
        b.Entity<AssetStatusHistory>().HasOne(x => x.ChangedByUser).WithMany()
            .HasForeignKey(x => x.ChangedBy).OnDelete(DeleteBehavior.Restrict);
        b.Entity<Attachment>().HasOne(x => x.Uploader).WithMany()
            .HasForeignKey(x => x.UploadedBy).OnDelete(DeleteBehavior.Restrict);
        b.Entity<MaintenanceSchedule>().HasOne(x => x.AssignedUser).WithMany()
            .HasForeignKey(x => x.AssignedTo).OnDelete(DeleteBehavior.Restrict);

        b.Entity<User>().Property(x => x.IsActive).HasDefaultValue(true);
        b.Entity<User>().Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
        b.Entity<Asset>().Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
        b.Entity<AuditLog>().Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
        b.Entity<AssetStatus>().Property(x => x.IsActive).HasDefaultValue(true);
    }
}

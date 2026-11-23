using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("Assets")]
public class Asset
{
    [Key] public int AssetId { get; set; }
    [Required, MaxLength(30)] public string AssetCode { get; set; } = string.Empty;
    [Required, MaxLength(200)] public string Name { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public int? LocationId { get; set; }
    public int StatusId { get; set; }
    [MaxLength(80)] public string? SerialNumber { get; set; }
    [MaxLength(100)] public string? Brand { get; set; }
    [MaxLength(100)] public string? Model { get; set; }
    public DateTime? PurchaseDate { get; set; }
    [Column(TypeName = "decimal(18,2)")] public decimal? PurchasePrice { get; set; }
    public DateTime? WarrantyUntil { get; set; }
    public int? AssignedUserId { get; set; }
    [MaxLength(500)] public string? Description { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public int? CreatedBy { get; set; }

    public Category Category { get; set; } = null!;
    public Location? Location { get; set; }
    public AssetStatus Status { get; set; } = null!;
    public User? AssignedUser { get; set; }

    public ICollection<QrCode> QrCodes { get; set; } = new List<QrCode>();
    public ICollection<AssetStatusHistory> StatusHistories { get; set; } = new List<AssetStatusHistory>();
    public ICollection<MaintenanceSchedule> MaintenanceSchedules { get; set; } = new List<MaintenanceSchedule>();
    public ICollection<MaintenanceRecord> MaintenanceRecords { get; set; } = new List<MaintenanceRecord>();
    public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
}

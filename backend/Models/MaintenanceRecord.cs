using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("MaintenanceRecords")]
public class MaintenanceRecord
{
    [Key] public int RecordId { get; set; }
    public int AssetId { get; set; }
    public int? ScheduleId { get; set; }
    public int? TechnicianId { get; set; }
    /// <summary>1 = Chờ xử lý, 2 = Đang thực hiện, 3 = Hoàn thành, 4 = Đã huỷ.</summary>
    public byte Status { get; set; } = 1;
    [MaxLength(20)] public string? RecordType { get; set; }
    [MaxLength(1000)] public string? Description { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    [Column(TypeName = "decimal(18,2)")] public decimal? Cost { get; set; }
    [MaxLength(500)] public string? Result { get; set; }
    public int? CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Asset Asset { get; set; } = null!;
    public MaintenanceSchedule? Schedule { get; set; }
    public User? Technician { get; set; }
    public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
}

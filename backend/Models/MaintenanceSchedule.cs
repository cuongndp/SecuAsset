using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("MaintenanceSchedules")]
public class MaintenanceSchedule
{
    [Key] public int ScheduleId { get; set; }
    public int AssetId { get; set; }
    public int? AssignedTo { get; set; }
    [Required, MaxLength(200)] public string Title { get; set; } = string.Empty;
    public int? IntervalDays { get; set; }
    public DateTime? NextDueDate { get; set; }
    public DateTime? LastDoneDate { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Asset Asset { get; set; } = null!;
    public User? AssignedUser { get; set; }
    public ICollection<MaintenanceRecord> Records { get; set; } = new List<MaintenanceRecord>();
}

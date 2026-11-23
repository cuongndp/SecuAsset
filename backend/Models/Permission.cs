using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("Permissions")]
public class Permission
{
    [Key] public int PermissionId { get; set; }
    [Required, MaxLength(50)] public string PermissionCode { get; set; } = string.Empty;
    [Required, MaxLength(150)] public string PermissionName { get; set; } = string.Empty;
    [MaxLength(50)] public string? ModuleName { get; set; }

    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

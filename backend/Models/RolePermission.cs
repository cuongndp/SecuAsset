using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("RolePermissions")]
public class RolePermission
{
    public int RoleId { get; set; }
    public int PermissionId { get; set; }
    public bool CanView { get; set; }
    public bool CanCreate { get; set; }
    public bool CanUpdate { get; set; }
    public bool CanDelete { get; set; }

    public Role Role { get; set; } = null!;
    public Permission Permission { get; set; } = null!;

    /// <summary>Kiểm tra quyền theo hành động: view, create, update, delete.</summary>
    public bool HasPermission(string action) => action?.ToLowerInvariant() switch
    {
        "view" or "read" => CanView,
        "create" or "add" => CanCreate,
        "update" or "edit" => CanUpdate,
        "delete" or "remove" => CanDelete,
        _ => false
    };
}

using AzureOpenAIProxy.Management.Components.ModelManagement;
using AzureOpenAIProxy.Management.Database;
using Microsoft.EntityFrameworkCore;

namespace AzureOpenAIProxy.Management.Services;

public class ModelService(IAuthService authService, AoaiProxyContext db) : IModelService
{
    public async Task<OwnerCatalog> AddOwnerCatalogAsync(ModelEditorModel model)
    {
        Owner owner = await authService.GetCurrentOwnerAsync();

        OwnerCatalog catalog = new()
        {
            Owner = owner,
            Active = model.Active,
            DeploymentName = model.DeploymentName!,
            EndpointKey = model.EndpointKey!,
            ModelType = model.ModelType!.Value,
            ResourceName = model.ResourceName!
        };

        await db.OwnerCatalogs.AddAsync(catalog);
        await db.SaveChangesAsync();

        return catalog;
    }

    public async Task<IEnumerable<OwnerCatalog>> GetOwnerCatalogsAsync()
    {
        string entraId = await authService.GetCurrentUserEntraIdAsync();
        return await db.OwnerCatalogs.Where(oc => oc.Owner.OwnerId == entraId).ToListAsync();
    }

}

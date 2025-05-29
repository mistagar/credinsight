using backend.Data;
using backend.Services.Interfaces;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using System;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<Context>(options =>
    options.UseInMemoryDatabase("KycInMemoryDb"));


builder.Services.AddScoped<IRiskAssessmentService, RiskAssessmentService>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
<<<<<<< HEAD
// Build Semantic Kernel
builder.Services.AddSingleton(_ =>
{
    var kernelBuilder = Kernel.CreateBuilder();
    kernelBuilder.AddAzureOpenAIChatCompletion(
        "",
        "",
        ""
    );

    var kernel = kernelBuilder.Build();
    // Register your C# plugin
    var TransactionCheckerPlugin = new TransactionsCheckerPlugin();
    var PersonalInfoPlugin = new PersonalInfoCheckerPlugin();
    kernel.Plugins.AddFromObject(TransactionCheckerPlugin, "TransactionChecker");
    kernel.Plugins.AddFromObject(PersonalInfoPlugin, "PersonalInfoChecker");
    return kernel;
});

// Register as a general assistant
builder.Services.AddScoped<IMainService, MainService>();

=======
>>>>>>> parent of 9563281 (KYC checker Added)


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<Context>();
    SeedData.Initialize(dbContext); 
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.UseCors();

app.Run();

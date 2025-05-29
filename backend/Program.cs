using backend.Data;
using backend.Services.Interfaces;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using System;
using backend.Utility.SniffingDog.Implementation;
using backend.Utility.SniffingDog.Interface;
using Microsoft.SemanticKernel;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<backend.Data.CredContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CredInsightConnection")));



builder.Services.AddScoped<IRiskAssessmentService, RiskAssessmentService>();

builder.Services.AddControllers()
    .AddJsonOptions(jsonOptions =>
    {
        jsonOptions.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        jsonOptions.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

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
    var KYCDeepVerificationCheckerPlugin = new KYCDeepVerificationChecker();
    kernel.Plugins.AddFromObject(TransactionCheckerPlugin, "TransactionChecker");
    kernel.Plugins.AddFromObject(PersonalInfoPlugin, "PersonalInfoChecker");
    kernel.Plugins.AddFromObject(KYCDeepVerificationCheckerPlugin, "KYCDeepVerificationChecker");
    return kernel;
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
    options.JsonSerializerOptions.WriteIndented = true; //for readability
});

// Register as a general assistant
builder.Services.AddScoped<IMainService, MainService>();



var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<CredContext>();
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

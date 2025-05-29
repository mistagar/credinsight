using Microsoft.SemanticKernel;
using System.ComponentModel;

namespace backend.Utility.SniffingDog.Implementation
{
    public class PersonalInfoCheckerPlugin
    {
        [KernelFunction("AnylyzeInformation")]
        [Description("Analyzes KYC data for possible fraud or invalid information.")]
        public string AnalyzeKycInfo(string kycJson)
        {
            var prompt = $@"
You are an AI fraud detection expert for KYC verification.

Here is a user's KYC information in JSON:
{kycJson}

Your job is to detect red flags. Consider the following:
- Is the street name realistic for the given city or region?
- Does the email domain look disposable (like mailinator.com, tempmail.com, etc.)?
- Is the name suspiciously generic or fabricated?
- Any mismatch between stated location and postal code?

If anything looks suspicious, explain clearly. If not, say everything looks good.

Respond in a clear, short format like:
- Valid: Yes/No
- Reason: ...
";

            return prompt;
        }
    }
}

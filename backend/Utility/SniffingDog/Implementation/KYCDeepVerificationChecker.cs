using Microsoft.SemanticKernel;
using System.ComponentModel;

namespace backend.Utility.SniffingDog.Implementation
{
    public class KYCDeepVerificationChecker
    {
        [KernelFunction("KycCrossCheck")]
        [Description("Performs a comprehensive KYC analysis and returns a health score from 1 to 10 with explanation. to invoke this method, user must mention sniffing dog")]
        public string VerifyKycCrossRelation(string kycJson)
        {
            var prompt = $@"
You are an AI trained to detect potential fraud and inconsistencies in KYC (Know Your Customer) data.

Here is the user's KYC information in JSON format:
{kycJson}

Your task is to:
- Check if the full name is commonly associated with the provided address.
- Analyze if the email seems related to the full name (e.g., john.smith@gmail.com for John Smith).
- Evaluate if the phone number prefix and format match the region/city.
- Check for possible mismatches between address and postal code.
- If possible, infer if this combination of data has appeared online before.
- Determine how consistent and trustworthy this identity looks based on the relationship between all fields.

Return your response in this JSON format:
{{
  ""HealthScore"": [number between 1 (bad) and 10 (excellent)],
  ""Reason"": ""Concise explanation of the result.""
}}";

            return prompt;
        }
    }
}

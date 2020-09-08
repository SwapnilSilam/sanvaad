
using System;

using SanvaadServer.DataModels;

namespace SanvaadServer.DataManger
{
    public static class SampleDataManager
    {
        public static SampleData GetData(string message)
        {
            return new SampleData()
            {
                Id = Guid.NewGuid().ToString(),
                SampleTime = DateTime.Now.ToString(),
                Message = message
            };
        }
    }
}

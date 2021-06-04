namespace Medico.Api.Constants
{
    public class AppConstants
    {
        public static class SearchConfiguration
        {
            public static int LookupItemsCount = 8;
        }

        public static class BuildInRoleNames
        {
            public static string SuperAdmin = "SuperAdmin";

            public static string Physician = "Physician";

            public static string Nurse = "Nurse";

            public static string MedicalAssistant = "MedicalAssistant";

            public static string Admin = "Admin";
        }

        public static class BuildInUsers
        {
            public static class SuperAdmin
            {
                public static string Name = "SuperAdmin";

                public static string Email = "superadmin@mail.com";
            }
        }
    }
}

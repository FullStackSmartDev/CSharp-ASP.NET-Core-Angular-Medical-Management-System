namespace Medico.Api.Email
{
    public static class EmailTemplates
    {
        public static class UserEmailConfirmation
        {
            public const string Subject =
                "Hi there {0} {1}, You have been invited to Medico Patient Portal, you can accept it through the link below.";

            public const string Body =
                "<a href='{0}'>clicking here</a> If you don't want to accept the invitation, please ignore this email. Your account won't be created until you access the link above and set your password. Thanks! Team Medico";
        }

        public static class UserForgotPassword
        {
            public const string Subject =
                "Hi there, You can reset your password through the link below.";

            public const string Body =
                "<a href='{0}'>clicking here</a> If you don't want to reset your password, please ignore this email. Thanks! Team Medico";
        }
    }
}
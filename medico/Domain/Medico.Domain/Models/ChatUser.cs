using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Medico.Domain.Models
{
    public class ChatUser
    {
        private static readonly List<ChatUser> Users = new List<ChatUser>();

        public string UserName { get; set; }
        public string ConnectionId { get; set; }
        [JsonIgnore]
        public ChatRoom CurrentRoom { get; set; }

        public static void Remove(ChatUser user)
        {
            Users.Remove(user);
        }

        public static ChatUser Get(string connectionId)
        {
            return Users.SingleOrDefault(u => u.ConnectionId == connectionId);
        }

        public static ChatUser Get(string userName, string connectionId)
        {
            lock (Users)
            {
                var current = Users.SingleOrDefault(u => u.ConnectionId == connectionId);

                if (current == default(ChatUser))
                {
                    current = new ChatUser
                    {
                        UserName = userName,
                        ConnectionId = connectionId
                    };
                    Users.Add(current);
                }
                else
                {
                    current.UserName = userName;
                }

                return current;
            }
        }
    }
}

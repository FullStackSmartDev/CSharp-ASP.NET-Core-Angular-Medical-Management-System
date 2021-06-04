using System.Collections.Generic;
using System.Linq;

namespace Medico.Domain.Models
{
    public class ChatRoom
    {
        private static readonly List<ChatRoom> Rooms = new List<ChatRoom>();

        public string Name { get; set; }

        public List<ChatUser> Users { get; set; } = new List<ChatUser>();

        public static int TotalUsers => Rooms.Sum(room => room.Users.Count);

        public static ChatRoom Get(string name)
        {
            lock (Rooms)
            {
                var current = Rooms.SingleOrDefault(r => r.Name == name);

                if (current == default(ChatRoom))
                {
                    current = new ChatRoom
                    {
                        Name = name
                    };
                    Rooms.Add(current);
                }

                return current;
            }
        }
    }
}

using Medico.Domain.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Medico.Api.Hubs
{
    public class WebRtcHub : Hub
    {
        private string iceUser = "testuser";
        private static DateTime lastPassReset = DateTime.MinValue;

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public RtcIceServer[] GetIceServers()
        {
            // Perhaps Ice server management.

            return new RtcIceServer[] { new RtcIceServer() { Username = "", Credential = "" } };
        }

        public async Task Join(string userName, string roomName)
        {
            var user = ChatUser.Get(userName, Context.ConnectionId);
            var room = ChatRoom.Get(roomName);

            if (user.CurrentRoom != null)
            {
                room.Users.Remove(user);
                await SendUserListUpdate(Clients.Others, room, false);
            }

            user.CurrentRoom = room;
            room.Users.Add(user);

            await SendUserListUpdate(Clients.Caller, room, true);
            await SendUserListUpdate(Clients.Others, room, false);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await HangUp();

            await base.OnDisconnectedAsync(exception);
        }

        public async Task HangUp()
        {
            try
            {
                var callingUser = ChatUser.Get(Context.ConnectionId);

                if (callingUser == null)
                {
                    return;
                }

                if (callingUser.CurrentRoom != null)
                {
                    callingUser.CurrentRoom.Users.Remove(callingUser);
                    await SendUserListUpdate(Clients.Others, callingUser.CurrentRoom, false);
                }

                ChatUser.Remove(callingUser);
            }
            catch (Exception exp)
            {

            }
        }

        // WebRTC Signal Handler
        public async Task SendSignal(string signal, string targetConnectionId)
        {
            var callingUser = ChatUser.Get(Context.ConnectionId);
            var targetUser = ChatUser.Get(targetConnectionId);

            // Make sure both users are valid
            if (callingUser == null || targetUser == null)
            {
                return;
            }

            // These folks are in a call together, let's let em talk WebRTC
            await Clients.Client(targetConnectionId).SendAsync("receiveSignal", callingUser, signal);
        }

        private async Task SendUserListUpdate(IClientProxy to, ChatRoom room, bool callTo)
        {
            await to.SendAsync(callTo ? "callToUserList" : "updateUserList", room.Name, room.Users);
        }
    }
}

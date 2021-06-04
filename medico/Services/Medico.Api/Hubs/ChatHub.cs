using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Medico.Api.Hubs
{
    public class ChatHub : Hub
    {
        public Task Send(string message)
        {
            return Clients.All.SendAsync("Send", message);
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }
    }
}

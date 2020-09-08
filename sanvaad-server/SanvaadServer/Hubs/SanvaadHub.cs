using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using SanvaadServer.DataManagers;
using SanvaadServer.DataModels;

using Microsoft.AspNetCore.SignalR;

namespace SanvaadServer.Hubs
{
    public class SanvaadHub : Hub<ISanvaadHub>
    {
        private readonly IPeerConnectionManager _peerConnectionManager = null;

        public SanvaadHub(IPeerConnectionManager peerConnectionManager)
        {
            _peerConnectionManager = peerConnectionManager;
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var peerConnection = _peerConnectionManager.RemoveConnection(Context.ConnectionId);
            await Clients.GroupExcept(peerConnection.RoomId, new List<string>() { Context.ConnectionId }).LeftRoom(peerConnection.RoomId, peerConnection.UserId);
        }

        public async Task SendMessageToAll(string roomId, Message message)
        {
            await Clients.GroupExcept(roomId, new List<string>() { Context.ConnectionId }).ReceiveMessage(message);
        }

        public async Task JoinedRoom(string roomId, string userId, string displayName)
        {
            var user = new User()
            {
                Uid = userId,
                DisplayName = displayName.Trim(),
                RoomId = roomId
            };

            _peerConnectionManager.CreateRoomAndAddConnection(new PeerConnection()
            {
                ConnectionId = Context.ConnectionId,
                RoomId = roomId,
                UserId = userId,
                User = user
            });

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            await Clients.GroupExcept(roomId, new List<string>() { Context.ConnectionId }).JoinedRoom(roomId, userId, displayName);
            await Clients.Client(Context.ConnectionId).GetSelfDetails(user);
        }

        public async Task LeftRoom()
        {
            var peerConnection = _peerConnectionManager.RemoveConnection(Context.ConnectionId);
            await Clients.GroupExcept(peerConnection.RoomId, new List<string>() { Context.ConnectionId }).LeftRoom(peerConnection.RoomId, peerConnection.UserId);
        }

        public async Task GetSelfDetails()
        {
            var user = _peerConnectionManager.GetSelfUserObject(Context.ConnectionId);
            await Clients.Client(Context.ConnectionId).GetSelfDetails(user);
        }

        public async Task GetRemoteUser(string userId)
        {
            var userName = _peerConnectionManager.GetRemoteUserName(userId);
            await Clients.Client(Context.ConnectionId).GetRemoteUser(userName, userId);
        }

        public async Task PaticipantsList(string roomId)
        {
            var users = _peerConnectionManager.GetPaticipants(roomId);
            await Clients.Client(Context.ConnectionId).PaticipantsList(users);
        }
    }
}

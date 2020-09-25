using System.Collections.Generic;
using System.Linq;

using SanvaadServer.DataModels;

namespace SanvaadServer.DataManagers
{
    public class PeerConnectionManager : IPeerConnectionManager
    {
        Dictionary<string, List<PeerConnection>> Rooms { get; set; }

        public PeerConnectionManager()
        {
            Rooms = new Dictionary<string, List<PeerConnection>>();
        }

        public List<User> GetPaticipants(string roomId)
        {
            List<User> users = new List<User>();

            if (Rooms.ContainsKey(roomId))
            {
                Rooms[roomId].ForEach(x => users.Add(x.User));
            }

            return users;
        }

        public void CreateRoomAndAddConnection(PeerConnection connection)
        {
            List<PeerConnection> connections;
            if (!Rooms.ContainsKey(connection.RoomId))
            {
                connections = new List<PeerConnection>();
                Rooms.Add(connection.RoomId, connections);
            }

            connections = Rooms[connection.RoomId];
            connections.Add(connection);
        }

        public PeerConnection RemoveConnection(string connectionId)
        {
            PeerConnection connection = null;
            List<PeerConnection> connections = Rooms.FirstOrDefault(x => x.Value.Where(y => y.ConnectionId == connectionId).Count() > 0).Value;

            if (connections != null)
            {
                connection = connections.Where(x => x.ConnectionId == connectionId).FirstOrDefault();

                if (connection != null)
                {
                    connections.Remove(connection);
                }

                if (connections.Count <= 0)
                {
                    Rooms.Remove(connection.RoomId);
                }
            }

            return connection;
        }

        public User GetSelfUserObject(string connectionId)
        {
            List<PeerConnection> connections = Rooms.FirstOrDefault(x => x.Value.Where(y => y.ConnectionId == connectionId).Count() > 0).Value;

            var connection = connections.Where(x => x.ConnectionId == connectionId).FirstOrDefault();

            return connection.User;
        }

        public string GetRemoteUserName(string userId)
        {
            List<PeerConnection> connections = Rooms.FirstOrDefault(x => x.Value.Where(y => y.UserId == userId).Count() > 0).Value;

            var connection = connections.Where(x => x.UserId == userId).FirstOrDefault();

            return connection.User.DisplayName;
        }

        public PeerConnection GetPeerConnection(string roomId, string userId)
        {
            var room = Rooms[roomId];

            return room.FirstOrDefault(x => x.UserId == userId);
        }

        public void UpdatePeerConnection(string roomId, PeerConnection peerConnection)
        {
            var room = Rooms[roomId];

            var oldPeerConnection = room.FirstOrDefault(x => x.UserId == peerConnection.UserId);

            if (oldPeerConnection != null)
            {
                room.Remove(oldPeerConnection);
                room.Add(peerConnection);
            }
        }

        public List<string> GetRemoteUserIdsForScreenSharing(string roomId, string userId)
        {
            List<string> userIds = new List<string>();

            var room = Rooms[roomId];
            if (room != null)
            {
                userIds = room.Where(x => x.UserId != userId).Select(y => y.ScreenSharingId).ToList();
            }

            return userIds;
        }
    }
}


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
            List<PeerConnection> connections = Rooms.FirstOrDefault(x => x.Value.Where(y => y.ConnectionId == connectionId).Count() > 0).Value;

            var connection = connections.Where(x => x.ConnectionId == connectionId).FirstOrDefault();

            if (connection != null)
            {
                connections.Remove(connection);
            }

            if (connections.Count <= 0)
            {
                Rooms.Remove(connection.RoomId);
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
    }
}

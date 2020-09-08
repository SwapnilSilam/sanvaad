using System.Collections.Generic;

using SanvaadServer.DataModels;

namespace SanvaadServer.DataManagers
{
    public interface IPeerConnectionManager
    {
        List<User> GetPaticipants(string roomId);
        void CreateRoomAndAddConnection(PeerConnection connection);
        PeerConnection RemoveConnection(string connectionId);
        User GetSelfUserObject(string connectionId);
        string GetRemoteUserName(string userId);
    }
}
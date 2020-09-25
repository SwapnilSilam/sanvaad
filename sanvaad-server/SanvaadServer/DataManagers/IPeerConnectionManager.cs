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
        PeerConnection GetPeerConnection(string roomId, string userId);
        void UpdatePeerConnection(string roomId, PeerConnection peerConnection);
        List<string> GetRemoteUserIdsForScreenSharing(string roomId, string userId);
    }
}
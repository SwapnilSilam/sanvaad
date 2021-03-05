using System.Collections.Generic;
using System.Threading.Tasks;

using SanvaadServer.DataModels;

namespace SanvaadServer.Hubs
{
    public interface ISanvaadHub
    {
        Task ReceiveMessage(Message message);
        Task JoinedRoom(string roomId, string userId, string displayName);
        Task LeftRoom(string roomId, string userId);
        Task GetSelfDetails(User user);
        Task GetRemoteUser(string userName, string userId);
        Task PaticipantsList(List<User> users);
        Task AddScreenSharingModality(string userId, string screenSharingCallId);
        Task ScreenSharingStatus(string status, string userName);
        Task ScreeenSharingStatusWithUserList(List<string> userIds, string status);
    }
}

namespace SanvaadServer.DataModels
{
    public class PeerConnection
    {
        public string RoomId { get; set; }
        public string UserId { get; set; }
        public string ConnectionId { get; set; }
        public string ScreenSharingId { get; set; }
        public User User { get; set; }
    }
}

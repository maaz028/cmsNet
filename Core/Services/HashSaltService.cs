using System.Security.Cryptography;

namespace Core.Services
{
    public class HashSaltService
    {
        public string? Hash { get; set; }
        public string? Salt { get; set; }

    }

    public class PasswordHashing
    {
        public static HashSaltService GenerateSaltedHash(int size, string password)
        {
            var saltBytes = new byte[size];
            var salt = Convert.ToBase64String(saltBytes);

            var rfc2898DeriveBytes = new Rfc2898DeriveBytes(password, saltBytes, 10000);
            var hashPassword = Convert.ToBase64String(rfc2898DeriveBytes.GetBytes(256));

            HashSaltService hashSalt = new() { Hash = hashPassword, Salt = salt };
            return hashSalt;
        }

        public static bool VerifyPassword (string? password, string? storedHash, string? storedSalt)
        {
            var saltBytes = Convert.FromBase64String(storedSalt);
            var rfc2898DeriveBytes = new Rfc2898DeriveBytes(password, saltBytes, 10000);
            return Convert.ToBase64String(rfc2898DeriveBytes.GetBytes(256)) == storedHash;
        }
    }
}
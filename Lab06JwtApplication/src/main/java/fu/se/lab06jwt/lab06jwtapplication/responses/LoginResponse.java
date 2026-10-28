package fu.se.lab06jwt.lab06jwtapplication.responses;


public record LoginResponse(String token, long expiresIn) {
}


// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.controller;

import fu.se.a3vuongvt_ce191082.entity.Customer;
import fu.se.a3vuongvt_ce191082.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        return ResponseEntity.ok(authService.login(email, password));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Customer customer) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerCustomer(customer));
    }
}

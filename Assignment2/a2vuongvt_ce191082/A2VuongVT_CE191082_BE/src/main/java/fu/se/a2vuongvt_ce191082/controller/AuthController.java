package fu.se.a2vuongvt_ce191082.controller;

import fu.se.a2vuongvt_ce191082.entity.SystemAccount;
import fu.se.a2vuongvt_ce191082.service.SystemAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final SystemAccountService accountService;

    public AuthController(SystemAccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/login")
    public ResponseEntity<SystemAccount> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        SystemAccount account = accountService.login(email, password);
        return ResponseEntity.ok(account);
    }
}

// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a2vuongvt_ce191082.controller;

import fu.se.a2vuongvt_ce191082.entity.SystemAccount;
import fu.se.a2vuongvt_ce191082.service.SystemAccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final SystemAccountService accountService;

    public AccountController(SystemAccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<List<SystemAccount>> getAllAccounts(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(accountService.getAllAccounts(search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SystemAccount> getAccountById(@PathVariable Short id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @PostMapping
    public ResponseEntity<SystemAccount> createAccount(@Valid @RequestBody SystemAccount account) {
        return ResponseEntity.status(HttpStatus.CREATED).body(accountService.createAccount(account));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SystemAccount> updateAccount(@PathVariable Short id, @Valid @RequestBody SystemAccount account) {
        return ResponseEntity.ok(accountService.updateAccount(id, account));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAccount(@PathVariable Short id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok(Map.of("message", "Xóa tài khoản thành công!"));
    }
}

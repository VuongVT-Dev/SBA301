// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a2vuongvt_ce191082.service;

import fu.se.a2vuongvt_ce191082.entity.SystemAccount;
import fu.se.a2vuongvt_ce191082.repository.NewsArticleRepository;
import fu.se.a2vuongvt_ce191082.repository.SystemAccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SystemAccountService {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleRepository newsArticleRepository;

    public SystemAccountService(SystemAccountRepository accountRepository, NewsArticleRepository newsArticleRepository) {
        this.accountRepository = accountRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    public SystemAccount login(String email, String password) {
        if (email == null || password == null) {
            throw new IllegalArgumentException("Vui lòng nhập đầy đủ Email và Mật khẩu!");
        }
        SystemAccount account = accountRepository.findByAccountEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new IllegalArgumentException("Email hoặc mật khẩu không chính xác!"));
        if (!account.getAccountPassword().equals(password)) {
            throw new IllegalArgumentException("Email hoặc mật khẩu không chính xác!");
        }
        return account;
    }

    public List<SystemAccount> getAllAccounts(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            return accountRepository.findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(kw, kw);
        }
        return accountRepository.findAll();
    }

    public SystemAccount getAccountById(Short id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản với ID: " + id));
    }

    public SystemAccount createAccount(SystemAccount account) {
        Optional<SystemAccount> existing = accountRepository.findByAccountEmailIgnoreCase(account.getAccountEmail().trim());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Email '" + account.getAccountEmail() + "' đã tồn tại trong hệ thống!");
        }
        if (account.getAccountId() == null) {
            short nextId = (short) (accountRepository.findAll().stream()
                    .mapToInt(a -> a.getAccountId() != null ? a.getAccountId() : 0)
                    .max()
                    .orElse(0) + 1);
            account.setAccountId(nextId);
        }
        account.setAccountEmail(account.getAccountEmail().trim());
        return accountRepository.save(account);
    }

    public SystemAccount updateAccount(Short id, SystemAccount updated) {
        SystemAccount existing = getAccountById(id);
        Optional<SystemAccount> byEmail = accountRepository.findByAccountEmailIgnoreCase(updated.getAccountEmail().trim());
        if (byEmail.isPresent() && !byEmail.get().getAccountId().equals(id)) {
            throw new IllegalArgumentException("Email '" + updated.getAccountEmail() + "' đã được sử dụng bởi tài khoản khác!");
        }
        existing.setAccountName(updated.getAccountName());
        existing.setAccountEmail(updated.getAccountEmail().trim());
        if (updated.getAccountRole() != null) {
            existing.setAccountRole(updated.getAccountRole());
        }
        if (updated.getAccountPassword() != null && !updated.getAccountPassword().trim().isEmpty()) {
            existing.setAccountPassword(updated.getAccountPassword());
        }
        return accountRepository.save(existing);
    }

    public void deleteAccount(Short id) {
        SystemAccount existing = getAccountById(id);
        if (newsArticleRepository.existsByCreatedBy_AccountId(existing.getAccountId())) {
            throw new IllegalStateException("Không thể xóa tài khoản này vì tài khoản đã tạo bài viết (NewsArticle)!");
        }
        accountRepository.delete(existing);
    }
}

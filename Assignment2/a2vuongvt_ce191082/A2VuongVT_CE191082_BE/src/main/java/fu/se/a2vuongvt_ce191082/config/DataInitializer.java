package fu.se.a2vuongvt_ce191082.config;

import fu.se.a2vuongvt_ce191082.repository.SystemAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SystemAccountRepository accountRepository;

    public DataInitializer(SystemAccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public void run(String... args) {
        long count = accountRepository.count();
        System.out.println("FUNewsManagementSBA301 connected successfully. Accounts in DB: " + count);
    }
}

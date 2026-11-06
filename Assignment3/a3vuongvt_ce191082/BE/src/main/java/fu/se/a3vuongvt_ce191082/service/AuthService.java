// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.service;

import fu.se.a3vuongvt_ce191082.config.JwtService;
import fu.se.a3vuongvt_ce191082.entity.Customer;
import fu.se.a3vuongvt_ce191082.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final JwtService jwtService;

    @Value("${app.staff.email}")
    private String staffEmail;

    @Value("${app.staff.alt-email:SteveParis@FUNewsManagement.org}")
    private String staffAltEmail;

    @Value("${app.staff.password}")
    private String staffPassword;

    @Value("${app.staff.name:Hotel Staff Admin}")
    private String staffName;

    public AuthService(CustomerRepository customerRepository, JwtService jwtService) {
        this.customerRepository = customerRepository;
        this.jwtService = jwtService;
    }

    public Map<String, Object> login(String email, String password) {
        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Vui lòng nhập đầy đủ Email và Mật khẩu!");
        }
        String cleanEmail = email.trim();

        // 1. Kiểm tra tài khoản Staff từ application.properties
        if ((cleanEmail.equalsIgnoreCase(staffEmail) || cleanEmail.equalsIgnoreCase(staffAltEmail))
                && staffPassword.equals(password)) {
            String token = jwtService.generateToken(cleanEmail, "STAFF", null);
            Map<String, Object> res = new HashMap<>();
            res.put("token", token);
            res.put("role", "STAFF");
            res.put("customerId", 0);
            res.put("customerFullName", staffName);
            res.put("emailAddress", cleanEmail);
            return res;
        }

        // 2. Kiểm tra tài khoản Customer trong Database
        Customer customer = customerRepository.findByEmailAddressIgnoreCase(cleanEmail)
                .orElseThrow(() -> new IllegalArgumentException("Email hoặc mật khẩu không chính xác!"));

        if (customer.getPassword() == null || !customer.getPassword().equals(password)) {
            throw new IllegalArgumentException("Email hoặc mật khẩu không chính xác!");
        }

        if (customer.getCustomerStatus() != null && customer.getCustomerStatus() == 0) {
            throw new IllegalStateException("Tài khoản khách hàng này đã bị vô hiệu hóa (Inactive)!");
        }

        String token = jwtService.generateToken(customer.getEmailAddress(), "CUSTOMER", customer.getCustomerId());
        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("role", "CUSTOMER");
        res.put("customerId", customer.getCustomerId());
        res.put("customerFullName", customer.getCustomerFullName());
        res.put("emailAddress", customer.getEmailAddress());
        res.put("telephone", customer.getTelephone());
        res.put("customerBirthday", customer.getCustomerBirthday());
        res.put("customerStatus", customer.getCustomerStatus());
        return res;
    }

    public Map<String, Object> registerCustomer(Customer input) {
        if (input.getCustomerFullName() == null || input.getCustomerFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Họ và tên không được để trống!");
        }
        if (input.getEmailAddress() == null || input.getEmailAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Email không được để trống!");
        }
        if (input.getTelephone() == null || input.getTelephone().trim().isEmpty()) {
            throw new IllegalArgumentException("Số điện thoại không được để trống!");
        }
        if (!input.getTelephone().trim().matches("^[0-9]{9,12}$")) {
            throw new IllegalArgumentException("Số điện thoại phải gồm từ 9 đến 12 chữ số!");
        }
        if (input.getPassword() == null || input.getPassword().trim().length() < 2) {
            throw new IllegalArgumentException("Mật khẩu phải có ít nhất 2 ký tự!");
        }

        String cleanEmail = input.getEmailAddress().trim();
        if (cleanEmail.equalsIgnoreCase(staffEmail) || cleanEmail.equalsIgnoreCase(staffAltEmail)) {
            throw new IllegalArgumentException("Email này thuộc quyền quản trị hệ thống, không thể đăng ký!");
        }

        Optional<Customer> existing = customerRepository.findByEmailAddressIgnoreCase(cleanEmail);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Email '" + cleanEmail + "' đã được đăng ký trong hệ thống!");
        }

        Customer newCustomer = new Customer();
        newCustomer.setCustomerFullName(input.getCustomerFullName().trim());
        newCustomer.setEmailAddress(cleanEmail);
        newCustomer.setTelephone(input.getTelephone().trim());
        newCustomer.setCustomerBirthday(input.getCustomerBirthday());
        newCustomer.setCustomerStatus(1);
        newCustomer.setPassword(input.getPassword());

        Customer saved = customerRepository.save(newCustomer);

        String token = jwtService.generateToken(saved.getEmailAddress(), "CUSTOMER", saved.getCustomerId());
        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("role", "CUSTOMER");
        res.put("customerId", saved.getCustomerId());
        res.put("customerFullName", saved.getCustomerFullName());
        res.put("emailAddress", saved.getEmailAddress());
        res.put("telephone", saved.getTelephone());
        res.put("customerBirthday", saved.getCustomerBirthday());
        res.put("customerStatus", saved.getCustomerStatus());
        return res;
    }
}

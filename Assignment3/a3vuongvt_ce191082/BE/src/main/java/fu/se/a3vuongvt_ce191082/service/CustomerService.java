// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.service;

import fu.se.a3vuongvt_ce191082.entity.Customer;
import fu.se.a3vuongvt_ce191082.repository.BookingReservationRepository;
import fu.se.a3vuongvt_ce191082.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final BookingReservationRepository bookingReservationRepository;

    public CustomerService(
            CustomerRepository customerRepository,
            BookingReservationRepository bookingReservationRepository
    ) {
        this.customerRepository = customerRepository;
        this.bookingReservationRepository = bookingReservationRepository;
    }

    public List<Customer> getAllCustomers(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            return customerRepository
                    .findByCustomerFullNameContainingIgnoreCaseOrEmailAddressContainingIgnoreCaseOrTelephoneContainingIgnoreCase(
                            kw, kw, kw
                    );
        }
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Integer id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng với ID: " + id));
    }

    public Customer getCustomerByEmail(String email) {
        return customerRepository.findByEmailAddressIgnoreCase(email.trim())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng với Email: " + email));
    }

    public Customer createCustomer(Customer customer) {
        validateCustomerFields(customer, true);
        String cleanEmail = customer.getEmailAddress().trim();
        Optional<Customer> existing = customerRepository.findByEmailAddressIgnoreCase(cleanEmail);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Email '" + cleanEmail + "' đã tồn tại trong hệ thống!");
        }
        customer.setCustomerId(null);
        customer.setCustomerFullName(customer.getCustomerFullName().trim());
        customer.setEmailAddress(cleanEmail);
        customer.setTelephone(customer.getTelephone().trim());
        if (customer.getCustomerStatus() == null) {
            customer.setCustomerStatus(1);
        }
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Integer id, Customer updated) {
        Customer existing = getCustomerById(id);
        validateCustomerFields(updated, false);

        String cleanEmail = updated.getEmailAddress().trim();
        Optional<Customer> byEmail = customerRepository.findByEmailAddressIgnoreCase(cleanEmail);
        if (byEmail.isPresent() && !byEmail.get().getCustomerId().equals(id)) {
            throw new IllegalArgumentException("Email '" + cleanEmail + "' đã được sử dụng bởi khách hàng khác!");
        }

        existing.setCustomerFullName(updated.getCustomerFullName().trim());
        existing.setEmailAddress(cleanEmail);
        existing.setTelephone(updated.getTelephone().trim());
        existing.setCustomerBirthday(updated.getCustomerBirthday());
        if (updated.getCustomerStatus() != null) {
            existing.setCustomerStatus(updated.getCustomerStatus());
        }
        if (updated.getPassword() != null && !updated.getPassword().trim().isEmpty()) {
            existing.setPassword(updated.getPassword());
        }
        return customerRepository.save(existing);
    }

    public void deleteCustomer(Integer id) {
        Customer existing = getCustomerById(id);
        if (bookingReservationRepository.existsByCustomer_CustomerId(id)) {
            throw new IllegalStateException(
                    "Không thể xóa khách hàng \"" + existing.getCustomerFullName()
                            + "\" vì khách hàng này đã có giao dịch đặt phòng (BookingReservation)!"
            );
        }
        customerRepository.delete(existing);
    }

    private void validateCustomerFields(Customer customer, boolean requirePassword) {
        if (customer.getCustomerFullName() == null || customer.getCustomerFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Họ tên khách hàng (CustomerFullName) không được để trống!");
        }
        if (customer.getEmailAddress() == null || customer.getEmailAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Email (EmailAddress) không được để trống!");
        }
        if (customer.getTelephone() == null || !customer.getTelephone().trim().matches("^[0-9]{9,12}$")) {
            throw new IllegalArgumentException("Số điện thoại (Telephone) phải gồm từ 9 đến 12 chữ số!");
        }
        if (requirePassword && (customer.getPassword() == null || customer.getPassword().trim().isEmpty())) {
            throw new IllegalArgumentException("Mật khẩu (Password) không được để trống!");
        }
    }
}

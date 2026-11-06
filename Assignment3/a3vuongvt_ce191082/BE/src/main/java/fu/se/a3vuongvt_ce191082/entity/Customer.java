// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "Customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerID")
    private Integer customerId;

    @NotBlank(message = "Họ tên khách hàng (CustomerFullName) không được để trống!")
    @Column(name = "CustomerFullName", length = 50)
    private String customerFullName;

    @NotBlank(message = "Số điện thoại (Telephone) không được để trống!")
    @Column(name = "Telephone", length = 12)
    private String telephone;

    @NotBlank(message = "Email (EmailAddress) không được để trống!")
    @Email(message = "Email không đúng định dạng!")
    @Column(name = "EmailAddress", nullable = false, unique = true, length = 50)
    private String emailAddress;

    @Column(name = "CustomerBirthday")
    private LocalDate customerBirthday;

    @Column(name = "CustomerStatus", columnDefinition = "tinyint")
    private Short customerStatus = 1;

    @Column(name = "Password", length = 50)
    private String password;

    public Customer() {
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getCustomerFullName() {
        return customerFullName;
    }

    public void setCustomerFullName(String customerFullName) {
        this.customerFullName = customerFullName;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public LocalDate getCustomerBirthday() {
        return customerBirthday;
    }

    public void setCustomerBirthday(LocalDate customerBirthday) {
        this.customerBirthday = customerBirthday;
    }

    public Integer getCustomerStatus() {
        return customerStatus != null ? customerStatus.intValue() : 1;
    }

    public void setCustomerStatus(Integer customerStatus) {
        this.customerStatus = customerStatus != null ? customerStatus.shortValue() : (short) 1;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

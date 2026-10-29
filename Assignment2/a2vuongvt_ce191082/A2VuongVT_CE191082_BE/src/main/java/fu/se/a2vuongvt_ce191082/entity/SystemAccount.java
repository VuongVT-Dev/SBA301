package fu.se.a2vuongvt_ce191082.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "SystemAccount")
public class SystemAccount {

    @Id
    @Column(name = "AccountID")
    private Short accountId;

    @NotBlank(message = "Tên tài khoản không được để trống")
    @Column(name = "AccountName")
    private String accountName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Column(name = "AccountEmail")
    private String accountEmail;

    @NotNull(message = "Vai trò không được để trống")
    @Min(value = 1, message = "Role chỉ nhận giá trị 1 (Admin) hoặc 2 (Staff)")
    @Max(value = 2, message = "Role chỉ nhận giá trị 1 (Admin) hoặc 2 (Staff)")
    @Column(name = "AccountRole")
    private Integer accountRole; // 1 = Admin, 2 = Staff

    @NotBlank(message = "Mật khẩu không được để trống")
    @Column(name = "AccountPassword")
    private String accountPassword;

    public SystemAccount() {
    }

    public SystemAccount(Short accountId, String accountName, String accountEmail, Integer accountRole, String accountPassword) {
        this.accountId = accountId;
        this.accountName = accountName;
        this.accountEmail = accountEmail;
        this.accountRole = accountRole;
        this.accountPassword = accountPassword;
    }

    public Short getAccountId() {
        return accountId;
    }

    public void setAccountId(Short accountId) {
        this.accountId = accountId;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountEmail() {
        return accountEmail;
    }

    public void setAccountEmail(String accountEmail) {
        this.accountEmail = accountEmail;
    }

    public Integer getAccountRole() {
        return accountRole;
    }

    public void setAccountRole(Integer accountRole) {
        this.accountRole = accountRole;
    }

    public String getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(String accountPassword) {
        this.accountPassword = accountPassword;
    }
}

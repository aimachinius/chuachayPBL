package com.example.demo.Model;

import jakarta.persistence.*;

// import java.lang.ref.Reference;k
import java.sql.Timestamp;
import java.util.Date;
import java.util.Objects;

@Entity
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_account")
    private int idAccount;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "phone")
    private String phone;

    @Column(name = "day_of_birth")
    private Date dayOfBirth;

    @Column(name = "country")
    private String country;

    @Column(name = "sex")
    private boolean sex;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "role", referencedColumnName = "id_role", nullable = true)
    private Role role;

    public Account() {
    }

    public Account(String email, String password, String phone, String fullName, Date dayOfBirth,
            String country) {
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.fullName = fullName;
        this.dayOfBirth = dayOfBirth;
        this.country = country;
        this.createdAt = new Timestamp(System.currentTimeMillis());
    }

    public int getIdAccount() {
        return idAccount;
    }

    public void setIdAccount(int idAccount) {
        this.idAccount = idAccount;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Date getDayOfBirth() {
        return dayOfBirth;
    }

    public void setDayOfBirth(Date dayOfBirth) {
        this.dayOfBirth = dayOfBirth;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public boolean isSex() {
        return sex;
    }

    public void setSex(boolean sex) {
        this.sex = sex;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Account account))
            return false;
        return idAccount == account.idAccount;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(idAccount);
    }

    @Override
    public String toString() {
        return "Account{" +
                "idAccount=" + idAccount +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", phone='" + phone + '\'' +
                ", fullName='" + fullName + '\'' +
                ", dayOfBirth=" + dayOfBirth +
                ", country='" + country + '\'' +
                ", sex=" + sex +
                ", createdAt=" + createdAt +
                ", role=" + role +
                '}';
    }

    public void copyFrom(Account other) {
        if (other == null)
            return;

        this.fullName = other.fullName;
        this.email = other.email;
        this.password = other.password;
        this.phone = other.phone;
        this.dayOfBirth = other.dayOfBirth;
        this.country = other.country;
        this.sex = other.sex;
        this.role = other.role; // shallow copy
    }
}
// Tạo tk -> Nhậpf Account bao gồm customer
// đăng nhập -> kiểm tra username và password có đúng không

package com.example.demo.Service;

import com.example.demo.Model.Account;
import com.example.demo.Model.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Repository.AccountRepo;
import com.example.demo.Enum.Permission;
import java.util.HashSet;
import java.util.Set;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AccountService {
    @Autowired
    private AccountRepo accountRepo;

    // Lấy tất cả account
    public List<Account> getAllAccount() {
        return accountRepo.findAll();
    }

    // Tạo mới account
    public boolean createAccount(Account account) {
        if (accountRepo.findByEmail(account.getEmail()) == null) {
            return false; // Tên đăng nhập đã tồn tại
        }
        account.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));

        return accountRepo.save(account) != null;
    }

    // Lấy account theo id
    public Optional<Account> getAccountById(int id) {
        return accountRepo.findById(id);
    }

    // Cập nhật account
    public Account updateAccount(int id, Account updatedAccount) {
        return accountRepo.findById(id).map(account -> {
            account.copyFrom(updatedAccount);
            return accountRepo.save(account);
        }).orElse(null);
    }

    public Account login(String username, String password) {
        Account userAccount = accountRepo.findByEmail(username);
        if (userAccount != null) {
            System.out.println("Found account");
            if (userAccount.getPassword().equals(password)) {
                return userAccount;
            } else {
                return null;
            }
        } else
            return null;
    }

    // Xóa account
    public boolean deleteAccount(int id) {
        if (accountRepo.existsById(id)) {
            accountRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean register(Account account) {
        if (accountRepo.existsById(account.getIdAccount())) {
            return false; // Tên đăng nhập đã tồn tại
        }
        account.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        accountRepo.save(account);
        return true; // Đăng ký thành công
    }
    //
    // public int Login(String username, String password) {
    // Account userAccount = AccountRepo.findByUsernameAndPassword(username,
    // password);
    // if (userAccount != null) {
    // if (userAccount.getRole().equals("admin")) {
    // return 1; // Admin
    // } else {
    // return 2; // User
    // }
    // } else {
    // return 0; // Error
    // }
    // }

    // public boolean checkLogin(String username, String password) {
    // HttpSession session = request.get; // Assuming you have a session object
    // available
    // if (username == "admin" && password == "admin") {
    // session.setAttribute("Role", "admin");
    // return true;
    // } else {
    // Account userAccount = AccountRepo.findByUsernameAndPassword(username,
    // password);
    // if (userAccount != null) {
    // session.setAttribute("Role", "user");
    // return true;
    // } else {
    // return false;
    // }
    // }
    // }
}

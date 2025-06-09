package com.example.demo.Controller;

import com.example.demo.Enum.Permission;
import com.example.demo.Model.Account;
import com.example.demo.Model.Role;
import com.example.demo.Service.AccountService;
// import com.example.demo.Service.RoleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // Lấy tất cả account
    @GetMapping("/all_account")
    public List<Account> getAllAccount() {
        return accountService.getAllAccount();
    }

    // Lấy account theo id
    @GetMapping("/{id}")
    public Optional<Account> getAccountById(@PathVariable int id) {
        return accountService.getAccountById(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        System.out.println(loginData.get("email"));
        System.out.println(loginData.get("password"));
        if (accountService.login(loginData.get("email"), loginData.get("password")) != null) {
            return ResponseEntity.ok("Đăng nhập thành công");
        } else {
            return ResponseEntity.status(401).body("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin tài khoản");
        }
    }

    // Tạo account mới
    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody Account account) {
        Set<Permission> permissions = new HashSet<>();
        permissions.add(Permission.BOOK_TICKET);
        // Tạo account mặc định là mua vé
        account.setRole(new Role("user", permissions));

        if (accountService.createAccount(account)) {
            System.out.println("Account created successfully");
            return ResponseEntity.ok("Tạo tài khoản thành công");
        } else {
            System.out.println("Account creation failed");
            return ResponseEntity.status(400).body("Thông tin không hợp lệ, vui lòng đăng kí lại");
        }
    }

    // Cập nhật account theo id
    @PutMapping("/{id}")
    public Account updateAccount(@PathVariable int id, @RequestBody Account account) {
        return accountService.updateAccount(id, account);
    }

    // Xóa account theo id
    @DeleteMapping("/{id}")
    public String deleteAccount(@PathVariable int id) {
        boolean deleted = accountService.deleteAccount(id);
        return deleted ? "Deleted successfully" : "Account not found";
    }

}
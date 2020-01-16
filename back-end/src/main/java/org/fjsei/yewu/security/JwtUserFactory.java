package org.fjsei.yewu.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.fjsei.yewu.entity.sei.Authority;
import org.fjsei.yewu.entity.sei.User;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class JwtUserFactory {

    private JwtUserFactory() {
    }

    public static JwtUser create(User user) {
        return new JwtUser(
                user.getId(),
                user.getUsername(),
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getPassword(),
                mapToGrantedAuthorities(user.heHasRoles()),
                user.getEnabled(),
                user.getLastPasswordResetDate()
        );
    }

    private static List<GrantedAuthority> mapToGrantedAuthorities(Set<Authority> authorities) {
        return authorities.stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getName().name()))
                .collect(Collectors.toList());
    }
}

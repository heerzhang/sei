package org.fjsei.yewu.model.geography;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "commonSeq")
    @SequenceGenerator(name = "commonSeq", initialValue = 1, allocationSize = 1, sequenceName = "SEQUENCE_COMMON")
    protected Long id;
    private String  name;        //世界--》国家和地区。
    @OneToMany(mappedBy = "country")
    private Set<Adminunit> ads;
}
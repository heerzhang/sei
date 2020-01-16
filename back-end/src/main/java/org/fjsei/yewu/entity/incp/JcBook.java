package org.fjsei.yewu.entity.incp;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
public class JcBook {
        @Id
        @GeneratedValue
        private Long id;

        private String title;

        private String isbn;

        @ManyToOne
        private JcAuthor author;
}


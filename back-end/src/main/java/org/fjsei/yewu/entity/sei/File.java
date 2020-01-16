package org.fjsei.yewu.entity.sei;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.fjsei.yewu.entity.sei.original.OriginalRecord;
import org.springframework.security.access.prepost.PreAuthorize;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "FILES")
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "filesSeq")
    @SequenceGenerator(name = "filesSeq", initialValue = 1, allocationSize = 1, sequenceName = "SEQUENCE_FILES")
    protected Long id;

    //实际的文件系统的路径名
    @Column(length =512)
    private String  url;

    //纳入用户系统控制。
    @ManyToOne
    @JoinColumn
    private User creator;

    private boolean anyoneCanSee=false;

    //原始记录的附带文件
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private OriginalRecord  originalRecord;

}


package org.fjsei.yewu.entity.sei.original;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.fjsei.yewu.entity.sei.File;
import org.fjsei.yewu.entity.sei.inspect.ISP;
import org.fjsei.yewu.filter.SimpleReport;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;



@Getter
@Setter
@NoArgsConstructor
@Entity
public class OriginalRecord  {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "commonSeq")
    @SequenceGenerator(name = "commonSeq", initialValue = 1, allocationSize = 1, sequenceName = "SEQUENCE_COMMON")
    protected Long id;

    private String  modeltype;
    private String  modelversion;

    private Date lastModify;
    private String state;

    @ManyToOne
    @JoinColumn
    private ISP isp;   //多份原始记录？-状态-删除无效

      //检验校核可修改的字段-JSON；
    private String  data;
    //审核修改的推导部分的数据字段-JSON；
    private String  deduction;

    @OneToMany(mappedBy="originalRecord" ,fetch = FetchType.LAZY)
    private Set<File> files;

    public  OriginalRecord(String modeltype, String modelversion, ISP isp, String data){
        this.modeltype=modeltype;
        this.modelversion=modelversion;
        this.isp=isp;
        this.data=data;
    }
}


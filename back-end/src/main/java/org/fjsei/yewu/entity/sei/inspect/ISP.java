package org.fjsei.yewu.entity.sei.inspect;

import lombok.Getter;
import lombok.Setter;
import org.fjsei.yewu.entity.sei.EQP;
import org.fjsei.yewu.entity.sei.Report;
import org.fjsei.yewu.entity.sei.User;
import org.fjsei.yewu.filter.SimpleReport;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.util.*;

//针对graphQL关联查询的安全问题，考虑把关对其他或低权限用户不可见的字段独立出来，JPA　三种继承映射策略。
//比如ISP extends ISPbase{ISPbase字段低保密性}，ISP可额外添加保密性要求高的其他字段，代码配置graphql返回对象类型正常都用ISPbase替换ISP。

@Getter
@Setter
@Entity
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE, region = "Fast")
public class ISP {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "commonSeq")
    @SequenceGenerator(name = "commonSeq", initialValue = 1, allocationSize = 1, sequenceName = "SEQUENCE_COMMON")
    protected Long id;
    //先有EQP,后来规划TASK了(1个task多eqp)，最后才为某task和某一个EQP去生产ISP的;
    //一个检验记录只有一个设备，一个设备EQP可有多个ISP检验。
    //若是ISP该从TASK挂接关系而来的，那么这里就不应该有EQP字段的，设备在TASK哪里去找。
    //检验单独生成，TASK和EQP多对多的；单个ISP检验为了某个EQP和某个TASK而生成的。
    //我是多端我来维护关联关系，我的表有直接外键的存储。
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private EQP dev;

    //单个检验记录规属于某一个TASK底下的某次;
    //一个任务单Task包含了多个的ISP检验记录。 　任务1：检验N；
    //我是多的方，我维护关系，我方表字段包含了对方表记录ID
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private Task task;
    //缺省 fetch= FetchType.LAZY
    //这里维护多对多关系，版本升级导致中间表ISP_ISP_MEN变成ISP_USERS；？需要自己指定表名,且字段名都也改了"ISPMEN_ID"　ISP_MEN_ID？
    @ManyToMany
    @JoinTable(name="ISP_ISP_MEN",joinColumns={@JoinColumn(name="ISP_ID")},inverseJoinColumns={@JoinColumn(name="ISP_MEN_ID")})
    @org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE,region ="Fast")
    private Set<User> ispMen;       //= new HashSet<>()
    //审核人员就一个
    //@ManyToOne(fetch = FetchType.LAZY)       //？分开的sql语句;
    @ManyToOne
    @JoinColumn
    private User checkMen;

    private Date    nextIspDate;
    private String  conclusion;
    //缺省, fetch= FetchType.EAGER
    @OneToMany(mappedBy ="isp")
    private Set<Report>  reps;
    //private Set<BaseReport>  reps;
    //改成安全的基础接口类－报错hibernate.AnnotationException: Use of @OneToMany or @ManyToMany targeting an unmapped class


    //graphQL内省都是查询的getxxx;
    public Set<SimpleReport>  getReps() {
        Set<SimpleReport>  parents = new HashSet<SimpleReport>();
        if(reps!=null)
            parents.addAll(reps);
        return  parents;    //到了这里实际数据还是Report，并没有变化，变的只是输出或前端可看见的范围。
    }

}



//变量名只能是字母a-z A-Z，数字0-9，下划线_组合，不能包含空格，数字不能放在变量名首位,不能用语言的保留字;

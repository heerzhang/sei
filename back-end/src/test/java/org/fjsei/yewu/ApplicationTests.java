package org.fjsei.yewu;

import org.fjsei.yewu.entity.sdn.StudentDao;
import org.fjsei.yewu.entity.sei.TeacherDao;
import org.fjsei.yewu.entity.sdn.Student;
import org.fjsei.yewu.entity.sei.Teacher;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
//import org.springframework.util.Assert;

@EnableTransactionManagement
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class ApplicationTests {

	@Qualifier("seiJdbcTemplate")
	@Autowired
	protected JdbcTemplate fooJdbcTemplate;

	@Qualifier("sdnJdbcTemplate")
	@Autowired
	protected JdbcTemplate barJdbcTemplate;

	@Autowired
	private StudentDao studentDao;
	@Autowired
	private TeacherDao teacherDao;
	//hez
	@PersistenceContext(unitName = "entityManagerFactorySei")
	private EntityManager emBar;
	@PersistenceContext(unitName = "entityManagerFactorySdn")
	private EntityManager emFoo;

	@Before
	public void setUp() {
		studentDao.save(new Student("成长东",13,6));
		teacherDao.save(new Teacher("赫尔张","64","数学"));
	}

	@Test
	@Transactional
	public void test() throws Exception {

		fooJdbcTemplate.update("insert into user(id,name,age) values(?, ?, ?)", 1, "aaa", 20);
		fooJdbcTemplate.update("insert into user(id,name,age) values(?, ?, ?)", 2, "bbb", 30);

		barJdbcTemplate.update("insert into user(id,name,age) values(?, ?, ?)", 1, "aaa", 20);

		//校验
		Assert.assertEquals("2", fooJdbcTemplate.queryForObject("select count(1) from user", String.class));
		Assert.assertEquals("1", barJdbcTemplate.queryForObject("select count(1) from user", String.class));

	}

	@Test
	public void test1() throws Exception {
		System.out.println(studentDao.findByName("aaa"));
		System.out.println(teacherDao.findByName("bbb"));
	}


    @Test
    @Rollback(false)
	@Transactional
    public void test3(){
        if(!emBar.isJoinedToTransaction())        System.out.println("noTransaction Yet");
		emBar.joinTransaction();
		Assert.assertTrue(emBar.isJoinedToTransaction());

		if(!emBar.isJoinedToTransaction())		System.out.println("isJoinedToTransaction?");
		//EntityTransaction  trans= entityManager.getTransaction();

        Teacher role =new Teacher("hezzhang","159","语文");
		//emBar.merge(role);

        emBar.flush();
		if(!emFoo.isJoinedToTransaction())
			emFoo.joinTransaction();
		emFoo.flush();
    }

}



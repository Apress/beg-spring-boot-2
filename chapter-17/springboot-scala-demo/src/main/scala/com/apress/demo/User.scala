package com.apress.demo


import javax.persistence._

import scala.beans.BeanProperty

@Entity
@Table(name="users")
class User {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @BeanProperty
  var id: Long = _

  @BeanProperty
  var name: String = _

  @BeanProperty
  var email: String = _

}
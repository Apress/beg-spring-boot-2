package com.apress.demo


import javax.persistence.*

@Entity
@Table(name="users")
class User(
        @Id @GeneratedValue(strategy = GenerationType.AUTO)
        var id: Long = -1,
        var name: String = "",
        var email: String = ""
        ) {

    override fun toString(): String {
        return "User(id=$id, name='$name', email='$email')"
    }
}